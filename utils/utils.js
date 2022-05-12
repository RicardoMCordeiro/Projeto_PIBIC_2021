export const years = () => {
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();

  const list = [];
  
  for (let i = anoAtual-4; i <= anoAtual; ++i) {
    list.push(i.toString());
  }
  return list;
};
  
export const optionsMap = (op) => {
  if (op === "31/03") return "0";
  else if (op === "30/06") return "1";
  else if (op === "30/09") return "2";
  else if (op === "31/12") return "3";
  else return "4";
};

export const adjustmentStatement = (demonstrative) => {
  if (demonstrative === "Consolidada") return "con";
  else if (demonstrative === "Individual") return "ind";
};
  
export const formatMoney = (val, hasSymbol, scale = 1000) => {
  const num = parseFloat(val) * scale;
  
  if (hasSymbol) {
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  } else {
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  }
};
  
export const hasArgs = (query) => Object.keys(query).length > 0;
  
export const formatPhone = (ddd, num) => {
  if(!ddd || !num) return null;

  return `(${ddd}) ${num}`
}