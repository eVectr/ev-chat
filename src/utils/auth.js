import users from "../constants/users"
import groups from "../constants/groups"

export const authenticateUser = data => {
    const user = users.find(
        existingUser =>
            existingUser.username == data.username
            && existingUser.password == data.password
    )

    return user
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

export const getGroup = () => {
    const group = localStorage.getItem('group')

    if (group) {
        return JSON.parse(group)
    }

    return {}
}