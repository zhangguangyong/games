import {IPosition} from 'components/Game/types'

export const Const = {
  EMPTY: ''
}

export const toPositionKey = ({y, x}: IPosition) => {
  return y + '-' + x
}

export const fromPositionKey = (key: string): IPosition => {
  let yx = key.split('-')
  return {y: +yx[0], x: +yx[1]}
}

export const getMapKeys = (map: Map<string, any>) => {
  let keys = map.keys()
  let retKeys: string[] = []
  for (const key of keys) {
    retKeys.push(key)
  }
  return retKeys
}

export const mapToObject = (map: Map<any, any>): any => {
  if (!map) {
    return
  }
  let obj: any = {}
  let keys = map.keys()
  for (const key of keys) {
    obj[key] = map.get(key)
  }
  return obj
}

export const objectToMap = (obj: any): Map<any, any> | undefined => {
  if (!obj) {
    return
  }
  let keys = Object.keys(obj)
  let map = new Map<any, any>()
  for (const key of keys) {
    map.set(key, obj[key])
  }
  return map
}






