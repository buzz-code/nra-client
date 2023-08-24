function getDefaultApiUrl() {
  const { hostname, port, protocol } = window.location;

  const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (hostname === 'localhost' || ipAddressRegex.test(hostname)) {
    const nextPort = port ? 8080 : (+port + 1);
    return `${protocol}//${hostname}:${nextPort}`;
  }

  return `${protocol}//api.${hostname}`;
}

export const apiUrl = process.env.REACT_APP_API_URL || getDefaultApiUrl();
