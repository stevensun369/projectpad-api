export function genID(length: number) {
  let code = '';

  for (let i = 0; i < length; i++) {
    let c = Math.floor(Math.random() * 9);
    code += c;
  }

  return code;
}

export function genCode(length: number) : string  {
  let code = '';

  for (let i = 0; i < length; i++) {
    let c = Math.floor(Math.random() * 9);
    code += c;
  }

  return code;
}