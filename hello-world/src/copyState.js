function copyState(state) {
  return JSON.parse(JSON.stringify(state))
}

export default copyState