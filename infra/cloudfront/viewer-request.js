// CloudFront Function (cloudfront-js-2.0), viewer request.
// - "/" answers a 301 to "/pt/" (the default locale, CLAUDE.md "URLs").
// - Page paths without a trailing slash answer a 301 to the same path with it.
// - Directory paths are served from their index.html (S3 with OAC does not resolve indexes).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === '/') {
    return redirect('/pt/');
  }

  var lastSegment = uri.slice(uri.lastIndexOf('/') + 1);
  if (lastSegment !== '' && lastSegment.indexOf('.') === -1) {
    return redirect(uri + '/');
  }

  if (uri.charAt(uri.length - 1) === '/') {
    request.uri = uri + 'index.html';
  }
  return request;
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: location } },
  };
}
