// Method to define a Pattern for any result returned to the user.
function ResultPattern() {
  return {
    Success: (data = null, message = 'Successful operation') => {
      return {ok: true, data, message};
    },
    Error: (message = 'Failed operation') => {
      return { ok: false, message};
    }
  }
}

// Method to get url to navigate through to the app
function getURL(page) {
  return ScriptApp.getService().getUrl() + (page ? `?page=${page}` : '');
}

// Method to handle user status
function UserSession(method = 'get', nameProperty, valueProperty) {
  const userProperties = PropertiesService.getUserProperties();
  const result = ResultPattern();

  if (method === 'get') {
    if (!nameProperty) return result.Error('The property name it\'s not defined');

    const getProperty = userProperties.getProperty(nameProperty);

    if (!getProperty) return result.Error(`The property "${nameProperty}" not exist or has a empty value`);
    
    return result.Success(getProperty);
  }
  else if (method === 'set') {
    if (!nameProperty || !valueProperty) return result.Error('Propety name or value is not defined');

    userProperties.setProperty(nameProperty, valueProperty);

    return result.Success(null, `The "${nameProperty}" property was defined correctly.`);
  }
  else if (method === 'delete') {
    if (!nameProperty) return result.Error('The property name it\'s not defined');
      
    userProperties.deleteProperty(nameProperty);

    return result.Success(null, `The ${nameProperty} property was deleted correctly`);
  }
  else {
    return result.Error(`The method "${method}" is not accepted`);
  }
}