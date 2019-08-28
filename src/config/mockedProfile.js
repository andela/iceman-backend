const facebook = {
  id: '2490900997658009',
  username: undefined,
  displayName: 'Samuel Kirimini Koroh',
  name: {
    familyName: 'Koroh',
    givenName: 'Samuel',
    middleName: 'Kirimini'
  },
  gender: undefined,
  profileUrl: undefined,
  emails: [{ value: 'samuelkoroh@gmail.com' }],
  photos:
    [{
      value:
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2490900997658009&height=50&width=50&ext=1569565681&hash=AeQBSXQxB0Hne32F'
    }],
  provider: 'facebook',
  _raw:
    '{"id":"2490900997658009","email":"samuelkoroh\\u0040gmail.com","name":"Samuel Kirimini Koroh","last_name":"Koroh","first_name":"Samuel","middle_name":"Kirimini","picture":{"data":{"height":50,"is_silhouette":false,"url":"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=2490900997658009&height=50&width=50&ext=1569565681&hash=AeQBSXQxB0Hne32F","width":50}}}',
  _json:
  {
    id: '2490900997658009',
    email: 'samuelkoroh@gmail.com',
    last_name: 'Koroh',
    first_name: 'Samuel',
    middle_name: 'Kirimini',
    picture:
    {
      data:
      {
        height: 50,
        is_silhouette: false,
        url:
          'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2490900997658009&height=50&width=50&ext=1569566077&hash=AeTYxB3GVCEEhpLt',
        width: 50
      }
    }
  }
};

const google = {
  id: '111246118864373963168',
  displayName: 'Samuel Koroh',
  name: { familyName: 'Koroh', givenName: 'Samuel' },
  emails: [{ value: 'samuelkoroh@gmail.com', verified: true }],
  photos:
    [{
      value:
        'https://lh5.googleusercontent.com/-WUXse3rcqLI/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reehqwq3qe1mqnWEvt44uLLkEA32g/photo.jpg'
    }],
  provider: 'google',
  _raw:
    '{\n  "sub": "111246118864373963168",\n  "name": "Samuel Koroh",\n  "given_name": "Samuel",\n  "family_name": "Koroh",\n  "picture": "https://lh5.googleusercontent.com/-WUXse3rcqLI/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reehqwq3qe1mqnWEvt44uLLkEA32g/photo.jpg",\n  "email": "samuelkoroh@gmail.com",\n  "email_verified": true,\n  "locale": "en"\n}',
  _json:
  {
    sub: '111246118864373963168',
    name: 'Samuel Koroh',
    given_name: 'Samuel',
    family_name: 'Koroh',
    picture:
      'https://lh5.googleusercontent.com/-WUXse3rcqLI/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reehqwq3qe1mqnWEvt44uLLkEA32g/photo.jpg',
    email: 'samuelkoroh@gmail.com',
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
