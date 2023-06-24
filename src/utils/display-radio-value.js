

function displayRadioValue(name) {
  if (typeof name !== "string") {
    throw new Error("Name has to be a string!");
  }
  const inputs = document.querySelectorAll(`[name="${name}"]`);

  for (let i = 0; i < inputs.length; i += 1) {
      if (inputs[i].checked) {
        return inputs[i].value 
      }         
  }
}

export default displayRadioValue