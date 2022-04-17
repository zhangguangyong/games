export const isUp = (e: any) => {
  return ['ArrowUp', 'w', 'i'].includes(e.key.toString())
}

export const isDown = (e: any) => {
  return ['ArrowDown', 's', 'k'].includes(e.key.toString())
}

export const isLeft = (e: any) => {
  return ['ArrowLeft', 'a', 'j'].includes(e.key.toString())
}

export const isRight = (e: any) => {
  return ['ArrowRight', 'd', 'l'].includes(e.key.toString())
}
