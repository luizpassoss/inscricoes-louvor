const API = 'https://inscricoes-louvor-api.onrender.com/api';

async function inscrever() {
    const cpfLimpo = cpf.value.replace(/\D/g, '');
  const telefoneLimpo = telefone.value.replace(/\D/g, '');
const body = {
  nome: nome.value,
  cpf: cpfLimpo,
  telefone: telefoneLimpo,
  email: email.value,
  forma_pagamento: forma_pagamento.value,
  plenaria: document.getElementById('plenaria').value
};

if (!body.plenaria) {
  msg.innerText = 'Selecione a plenária';
  return;
}

  if (!body.forma_pagamento) {
    msg.innerText = 'Selecione a forma de pagamento';
    return;
  }
 // Validação do e-mail (deve conter '@')
  if (!body.email || !body.email.includes('@')) {
    msg.innerText = 'Informe um e-mail válido (deve conter "@")';
    return;
  }
  const res = await fetch(`${API}/inscricoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    msg.innerText = data.error;
    return;
  }
// ✅ MOSTRA A MENSAGEM
mostrarAvisoPagamento();

// ⏳ Aguarda a mensagem aparecer antes de redirecionar
setTimeout(() => {
  if (body.forma_pagamento === 'PIX') {
    window.location.href = `/pix.html?id=${data.id}`;
  }

  if (body.forma_pagamento === 'CARTAO') {
    window.location.href =
      'https://link.infinitepay.io/ministeriolouvorsede/VC1D-81pFncxYF-48,00';
  }
}, 8000); // 2 segundos (ideal para leitura)
}

// Máscara para CPF
const cpfInput = document.getElementById('cpf');
cpfInput.addEventListener('input', () => {
  let value = cpfInput.value.replace(/\D/g, ''); // remove tudo que não é número
  if(value.length > 11) value = value.slice(0,11);
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  cpfInput.value = value;
});

// Máscara para Telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', () => {
  let value = telefoneInput.value.replace(/\D/g, '');
  if(value.length > 11) value = value.slice(0,11);
  value = value.replace(/(\d{2})(\d)/, '($1) $2');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  telefoneInput.value = value;
});

function mostrarAvisoPagamento() {
  const notice = document.getElementById('paymentNotice');
  notice.classList.add('show');

  setTimeout(() => {
    notice.classList.remove('show');
  }, 7000);
}

