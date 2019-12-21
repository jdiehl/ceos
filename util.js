exports.getEnv = (name, type) => {
  let value = process.env[name]
  if (value === undefined) throw new Error(`Missing Environment Variable ${name}`)
  switch (type) {
    case 'int':
      value = parseInt(value, 10)
      if (isNaN(value)) throw new Error(`Invalid Environment Variable ${name}: Must be an integer`)
      break
    case 'float':
      value = parseFloat(value)
      if (isNaN(value)) throw new Error(`Invalid Environment Variable ${name}: Must be a float`)
      break
  }
  return value
}
