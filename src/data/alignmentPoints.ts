/** 位置合わせパターンの位置。 */
export const alignmentPoints: { [type: number]: number[] } = {}

for (let type = 2; type <= 40; type++) {
  alignmentPoints[type] = []
  const size = 17 + type * 4
  let alignmentCount = 1
  if (type <= 6) alignmentCount = 2
  else if (type <= 13) alignmentCount = 3
  else if (type <= 20) alignmentCount = 4
  else if (type <= 27) alignmentCount = 5
  else if (type <= 34) alignmentCount = 6
  else alignmentCount = 7

  const l = Math.ceil((size - 13) / (alignmentCount - 1) / 2) * 2
  let offset = 0
  for (let i = alignmentCount - 1; i > 0; i--) {
    alignmentPoints[type][i] = size - 7 - offset
    offset += l
  }
  alignmentPoints[type][0] = 6
}

alignmentPoints[32] = [6, 34, 60, 86, 112, 138]
