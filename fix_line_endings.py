for name in ['.htpasswd', '.htaccess']:
    with open(name, 'rb') as f:
        data = f.read()
    data = data.replace(b'\r\n', b'\n').replace(b'\r', b'\n')
    with open(name, 'wb') as f:
        f.write(data)
    print(f'Fixed {name}')
