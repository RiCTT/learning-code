console.log("fileName: (2, 2)")
console.log(1);

function func() {
  console.log("fileName: (5, 4)")
  console.info(2);
}

export default class Clazz {
  say() {
    console.log("fileName: (10, 6)")
    console.debug(3);
  }

  render() {
    return <div>{[console.log("fileName: (13, 19)"), console.error(4)]}</div>;
  }

}