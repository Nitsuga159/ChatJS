const username = (username: string): string => {
  if (/\d/.test(username.substring(0, 4))) return "must start with 4 letters";

  if (/[^\w.-]/.test(username))
    return "cannot contain special characters such as <, >, !, $...";

  if (username.length < 5) return "must have at least five characters";

  if (username.length > 30) return "the maximum length is 30";

  return "";
};

const password = (password: string): string => {
  if (password.length < 8) return "must have at least 8 characters";

  if (password.length > 200) return "the maximum length is 200";

  return "";
};

const repeatPassword = (repeatPassword: string, password: string): string => {
  if (repeatPassword !== password)
    return "must be the same as the other password";

  return "";
};

const mail = (mail: string): string => {
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    return "must be a valid email address";

  return "";
};

export default {
  username,
  password,
  mail,
  "repeat-password": repeatPassword,
};
