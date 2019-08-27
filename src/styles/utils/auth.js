import users from "../constants/users"
import groups from "../constants/groups"

export const authenticateUser = data => {
    const user = users.find(
        existingUser =>
            existingUser.username == data.username
            && existingUser.password == data.password
    )
   
    let error = user ? null : 'invalid credentials'

    return [user, error]
}

export const authenticateGroup = data => {
    const group = groups.find(
        existingGroup =>
            existingGroup.groupName == data.groupName
    )

    return group
}

export const getUser = () => {
    const user = localStorage.getItem('user')

    if (user) {
        return JSON.parse(user)
    }

    return {}
}


export const removeUser = () => {
    const user = localStorage.removeItem()
}

export const getGroup = () => {
    const group = localStorage.getItem('group')

    if (group) {
        return JSON.parse(group)
    }

    return {}
}