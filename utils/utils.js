export const years = () => {
    const list = [];
  
    for (let i = 2016; i <= 2020; ++i) {
      list.push(i.toString());
    }
    return list;
  };
  
  export const optionsMap = (op) => {
    if (op === "31/03") return "1";
    else if (op === "30/06") return "2";
    else if (op === "30/09") return "3";
    else return "4";
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