
const formatOutput = (token: string) => {
    if (token[0] === ':' || token[0] === '-') {
        return token.slice(2)
    } else {
        return token
    }
} 

export default formatOutput;