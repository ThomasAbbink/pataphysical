import faker from 'faker'

export const generateShapeName = () => {
  return faker.fake('{{hacker.verb}} {{vehicle.type}}')
}
