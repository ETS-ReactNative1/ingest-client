export default function csvIsValid(errors) {
  return !Object.values(errors).some(err => err)
}
