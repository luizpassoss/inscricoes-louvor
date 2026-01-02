const API = 'https://inscricoes-louvor-api.onrender.com/api';
let editarId = null;

// Abrir modal e preencher dados
async function editar(id) {
  editarId = id;

  try {
    const res = await fetch(`${API}/inscricoes/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar inscrição');
    const i = await res.json();

    // Preencher campos
    document.getElementById('editNome').value = i.nome;
    document.getElementById('editEmail').value = i.email;
    document.getElementById('editCpf').value = i.cpf;
    document.getElementById('editTelefone').value = i.telefone;

    // Corrigir seleção do select de Plenária
    const selectPlenaria = document.getElementById('editPlenaria');
    for (let option of selectPlenaria.options) {
      option.selected = option.value === i.plenaria;
    }

    // Abrir modal
    document.getElementById('editModal').style.display = 'flex';
  } catch (err) {
    alert('Não foi possível abrir o modal: ' + err.message);
  }
}


// Fechar modal
function fecharModal() {
  document.getElementById('editModal').style.display = 'none';
  editarId = null;
}

// Enviar formulário
document.getElementById('editForm').addEventListener('submit', async e => {
  e.preventDefault();

  const body = {
    nome: document.getElementById('editNome').value,
    email: document.getElementById('editEmail').value,
    cpf: document.getElementById('editCpf').value.replace(/\D/g, ''),
    telefone: document.getElementById('editTelefone').value.replace(/\D/g, ''),
    plenaria: document.getElementById('editPlenaria').value
  };

  try {
    const res = await fetch(`${API}/admin/inscricoes/${editarId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Erro ao salvar inscrição');

    fecharModal();
    carregar();
  } catch (err) {
    alert(err.message);
  }
});

// Fechar modal clicando fora
window.onclick = function(event) {
  if (event.target == document.getElementById('editModal')) {
    fecharModal();
  }
};

// =======================
// CARREGAR INSCRIÇÕES
// =======================
async function carregar() {
  const res = await fetch(`${API}/admin/inscricoes`);
  const dados = await res.json();
  document.getElementById('total').innerText = dados.length;

  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  dados.forEach(i => {
    lista.innerHTML += `
      <tr>
        <td data-label="Nome">${i.nome}</td>
        <td data-label="Email">${i.email}</td>
        <td data-label="Plenária">${i.plenaria || '-'}</td>
        <td data-label="Pagamento">${i.forma_pagamento}</td>
        <td data-label="Status">
          <span class="status ${i.status_pagamento.toLowerCase()}">${i.status_pagamento}</span>
        </td>
        <td data-label="Ação">
          <button onclick="editar(${i.id})"
 title="Editar inscrição">
            <i data-lucide="edit-2"></i>
          </button>
          ${
            i.status_pagamento === 'PENDENTE'
              ? `<button onclick="confirmar(${i.id})" title="Confirmar pagamento">
                   <i data-lucide="check"></i>
                 </button>
                 <button onclick="excluir(${i.id})" title="Excluir inscrição">
                   <i data-lucide="trash-2"></i>
                 </button>`
              : `<button onclick="excluir(${i.id})" title="Excluir inscrição">
                   <i data-lucide="trash-2"></i>
                 </button>`
          }
        </td>
      </tr>
    `;
  });

  lucide.createIcons();
}

async function confirmar(id) {
  const res = await fetch(`${API}/admin/confirmar/${id}`, { method: 'POST' });
  const data = await res.json();

  if (!res.ok) {
    alert(data.error || 'Erro ao confirmar pagamento');
    return;
  }

  // Redirecionar para a tela de agradecimento com query string
  window.location.href = `agradecimento.html?id=${id}`;
}

// =======================
// EXCLUIR INSCRIÇÃO
// =======================
async function excluir(id) {
  if (!confirm('Tem certeza que deseja excluir esta inscrição?')) return;

  await fetch(`${API}/admin/inscricoes/${id}`, { method: 'DELETE' });
  carregar();
}





// =======================
// EXPORTAR PDF
// =======================
async function exportarPDF() {
  const res = await fetch(`${API}/admin/inscricoes`);
  const dados = await res.json();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Relatório de Inscrições', 14, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Evento Louvor', 14, 26);
  doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 32);

  doc.setDrawColor(220);
  doc.line(14, 36, 196, 36);

  doc.autoTable({
    startY: 40,
    head: [['Nome', 'Email', 'Plenária', 'CPF', 'Pagamento', 'Status']],
    body: dados.map(i => [
      i.nome,
      i.email,
      i.plenaria || '-',
      i.cpf || '-',
      i.forma_pagamento,
      i.status_pagamento
    ]),
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 4, valign: 'middle' },
    headStyles: { fillColor: [15, 118, 110], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 }
  });

  doc.save('inscricoes-evento-louvor.pdf');
}

// =======================
// INICIALIZAÇÃO
// =======================
carregar();
