console.log("filename: (2 2)", 1);

function func() {
  console.info("filename: (5 4)", 2);
}

export default class Clazz {
  say() {
    console.debug("filename: (10 6)", 3);
  }

  render() {
    return <div>{console.error("filename: (13 19)", 4)}</div>;
  }

}