export function genID() {}

export function genCode(length: number) : string  {
  let c = Math.random();
  let code = '';

  for (let i = 0; i < length; i++) {
    let c = Math.floor(Math.random() * 9);
    code += c;
  }

  return code;
}