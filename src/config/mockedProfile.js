const facebook = {
  id: '2095868869373636',
  username: undefined,
  displayName: 'Obas jerry Umokoro',
  name: {
    familyName: 'Umokoro',
    givenName: 'Obas',
    middleName: 'jerry'
  },
  gender: undefined,
  profileUrl: undefined,
  emails: [{ value: 'test@gmail.com' }],
  photos:
  [{
    value:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2095868869373636&height=50&width=50&ext=1569565681&hash=AeQBSXQxB0Hne32F'
  }],
  provider: 'facebook',
  _raw:
    '{"id":"2095868869373636","email":"test\\u0040gmail.com","name":"Obas jerry Umokoro","last_name":"Umokoro","first_name":"Obas","middle_name":"jerry","picture":{"data":{"height":50,"is_silhouette":false,"url":"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=2095868869373636&height=50&width=50&ext=1569565681&hash=AeQBSXQxB0Hne32F","width":50}}}',
  _json:
  {
    id: '2095868869373636',
    email: 'test@gmail.com',
    last_name: 'Umokoro',
    first_name: 'Obas',
    middle_name: 'jerry',
    picture:
    {
      data:
      {
        height: 50,
        is_silhouette: false,
        url:
          'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2095868869373636&height=50&width=50&ext=1569566077&hash=AeTYxB3GVCEEhpLt',
        width: 50
      }
    }
  }
};

const google = {
  id: '857578736364757586',
  displayName: 'Obas Umokoro',
  name: { familyName: 'Umokoro', givenName: 'Obas' },
  emails: [{ value: 'test@gmail.com', verified: true }],
  photos:
  [{
    value:
      'https://lh5.googleusercontent.com/-WUXse3rcqLI/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reehqwq3qe1mqnWEvt44uLLkEA32g/photo.jpg'
  }],
  provider: 'google',
  _raw:
    '{\n  "sub": "857578736364757586",\n  "name": "Obas Umokoro",\n  "given_name": "Obas",\n  "family_name": "Umokoro",\n  "picture": "https://lh5.googleusercontent.com/-WUXse3rcqLI/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reehqwq3qe1mqnWEvt44uLLkEA32g/photo.jpg",\n  "email": "test@gmail.com",\n  "email_verified": true,\n  "locale": "en"\n}',
  _json:
  {
    sub: '857578736364757586',
    name: 'Obas Umokoro',
    given_name: 'Obas',
    family_name: 'Umokoro',
    picture:
      'https://lh5.googleusercontent.com/-WUXse3rcqLI/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reehqwq3qe1mqnWEvt44uLLkEA32g/photo.jpg',
    email: 'test@gmail.com',
    email_verified: true,
    locale: 'en'
  }
};

const unauthorized = undefined;
export default {
  google,
  facebook,
  unauthorized
};
