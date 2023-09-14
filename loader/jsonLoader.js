export default function (source) {
  console.log('jsonLoader');
  return `export default ${JSON.stringify(JSON.parse(source))}`;
}
