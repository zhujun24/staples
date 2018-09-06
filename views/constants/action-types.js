const actionTypes = {}

export const actionTypeCreator = name => {
  actionTypes[name] = name
}

export const ajaxActionTypeCreator = name => {
  actionTypeCreator(`${name}_START`)
  actionTypeCreator(`${name}_SUCCESS`)
  actionTypeCreator(`${name}_ERROR`)
}

export default actionTypes
