import microValidator from "micro-validator"

function loginValidation(data) {
    
    const errors = microValidator.validate({
        username: {
        required: {
          errorMsg: `Please enter username`
        }
      },
      password: {
        required: {
          errorMsg: `please enter password`
        }
      },
    }, data)
   
    return errors
}
export default loginValidation