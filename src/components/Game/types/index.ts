import React from 'react'

export interface IPosition {
  y: number,
  x: number
}

export interface IGrid {
  rows: number
  cols: number
  width: number
  height: number
  children?: any
  style?: React.CSSProperties

  cellStyle?(cell: ICell): React.CSSProperties
}

export interface ICell {
  width?: number
  height?: number
  position: IPosition
  props?: any
  children?: any
  style?: React.CSSProperties
}
