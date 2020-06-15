---
title: Configuración inicial de un servidor CentOS 8
description:
date: 2020-06-16
---

## Introducción

Cuando contratamos un VPS (Servidor Privado Virtual) o un servidor dedicado, el primer paso que debemos dar antes de montar nuestro stack de desarrollo (LAMP, MEAN, o cualquier otro) es hacer una configuración básica y securización del sistema. Para este artículo vamos a centrarnos en la primera parte, la configuración inicial de un sistema CentOS 8.

## Acceder al sistema

Partimos del punto en el que nuestro proveedor de hosting nos ha facilitado la dirección IP del equipo, la contraseña 'root', y el servidor tiene habilitado el acceso SSH.

Realizamos la conexión SSH como 'root' hacia el servidor.

```shell
ssh root@HOST
```

Pudiendo ser `HOST` la dirección ip de la máquina, el hostname (si lo tenemos definido en nuestro archivo `/etc/hosts`) o el dominio (si tenemos alguno vinculado).

Y nos autenticamos con la contraseña facilitada.

Si es la primera vez que intentamos acceder a este host, es posible que el sistema nos pida confirmación para añadirlo a la lista de hosts conocidos y confiables. Aceptamos.

## Actualizar el sistema e instalaciones básicas

Actualizamos todos los paquetes instalados.

```shell
dnf update
```

Vamos a necesitar un editor de texto plano para editar los archivos de configuración del sistema. Aunque ya tenemos instalado 'vim', si no dominamos este programa podemos instalar alguno mas sencillo como por ejemplo 'nano'.

```shell
dnf install nano
```

## Gestión de usuarios

Cambiamos la contraseña 'root' que nos ha facilitado nuestro proveedor de hosting por una propia.

```shell
passwd
```

Creamos otro usuario personal que será el que empleemos para acceder al sistema, dejando al usuario 'root' unicamente para las tareas que lo requieran. El mio lo voy a llamar 'eliot'.

```shell
adduser eliot
```

Definimos su contraseña.

```shell
passwd eliot
```

Si queremos que el usuario tenga priviliegios de administración (el poder emplear `sudo`) hemos de añadirlo al grupo 'wheel'.

```shell
gpasswd -a eliot wheel
```

Una buena práctica de seguridad es inhabilitar el acceso 'root' por SSH. Siempre podremos acceder al sistema con nuestro nuevo usuario y una vez dentro escalar privilegios hacia 'root' cuando necesitemos hacer alguna tarea de administración, empleando `sudo` o haciendo un cambio de usuario con `su`. Para ello vamos a editar el archivo `/etc/ssh/sshd_config` para descomentar y cambiar la siguiente directiva.

```properties /etc/ssh/sshd_config
PermitRootLogin no
```

Recargamos el servidor SSH para que los cambios tengan efecto.

```shell
systemctl reload sshd
```

## Nombre de equipo

Para gestionar el nombre del equipo disponemos de la herramienta `hostnamectl`. Si la invocamos sin argumentos nos da información de la configuración actual.

```shell
hostnamectl
```

```text
   Static hostname: darlene
         Icon name: computer-laptop
           Chassis: laptop
        Machine ID: c9b2db947bbe462ba4b6e898ca504e37
           Boot ID: 5254e3f939844457827455210c722d60
  Operating System: Manjaro Linux
            Kernel: Linux 5.3.8-3-MANJARO
      Architecture: x86-64
```

Podemos cambiar el valor con el argumento `set-hostname`, para mi ejemplo la voy a llamar 'fsociety'.

```shell
hostnamectl set-hostname fsociety
```

## Idioma

La herramienta con la que podemos cambiar el idioma del sistema (locale) es `localectl`. Igual que en el caso anterior, invocándola sin argumentos nos permite ver la configuaración actual.

```shell
localectl
```

```text
   System Locale: LANG=es_ES.UTF-8
       VC Keymap: es
      X11 Layout: es
       X11 Model: pc105
```

Para ver una lista de los idiomas instalados en el sistema podemos emplear el argumento `list-locales`.

```shell
localectl list-locales
```

> Si nuestro idioma no está disponible en la lista hemos de instalarlo. Podemos hacer una búsqueda en el repositorio de CentOS de todos los paquetes de idiomas.
>
> ```shell
> dnf list glibc-langpack-*
> ```
>
> Instalamos el que queramos, por ejemplo el español.
>
> ```shell
> dnf install glibc-langpack-es
> ```

Y hacemos el cambio a nuestro idioma con el argumento `set-locale`, en el ejemplo estoy cambiando a español de España con codificación de caracteres 'utf-8'.

```shell
localectl set-locale LANG=es_ES.utf8
```

## Zona horaria y sincronización NTP

Para configurar la zona horaria disponemos de la herramienta `timedatectl`. Otra vez, invocandola sin argumentos nos permite ver la configuración actual.

```shell
timedatectl
```

```text
               Local time: vie 2019-11-08 13:01:04 CET
           Universal time: vie 2019-11-08 12:01:04 UTC
                 RTC time: vie 2019-11-08 12:01:04
                Time zone: Europe/Madrid (CET, +0100)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

Listamos todas las zonas horarias disponibles con el argumento `list-timezones`.

```shell
timedatectl list-timezones
```

Con el argumento `set-timezone` la cambiamos, en mi caso a la zona horaria española.

```shell
timedatectl set-timezone Europe/Madrid
```

El comando `timedatectl` tambien nos informa de si está activa o no la sincronización horaria por NTP, por lo general cualquier instalación de CentOS 8 la tendría, si no lo está, hemos de instalar y habilitar 'chrony'.

```shell
dnf install chrony
systemctl start chronyd
systemctl enable chronyd
```

## SELinux

SELinux es un módulo de seguridad del kernel linux que añade politicas de seguridad extra a las generales de linux (usuarios y grupos). Pero como contrapartida hace mas compleja la configuración de nuestro entorno.

Los tres posibles estados de SELinux son:

- **Enforcing**: Deniega todos los accesos no autorizados a los recursos en base a las políticas de seguridad definidas.
- **Permissive**: Permite todos los accesos, pero muestra una alerta cuando no se cumplan las políticas de seguridad.
- **Disabled**: SELinux deshabilitado.

Podemos ver el estado actual empleando los comandos `getenforce` o `sestatus`.

Para cambiar el estado hemos de editar el archivo `/etc/selinux/config`, modificamos el valor de la directiva 'SELINUX', en este caso vamos a cambiar a modo permisivo.

```properties /etc/selinux/config
SELINUX=permissive
```

Guardamos y reiniciamos el sistema para aplicar los cambios.

```shell
systemctl reboot
```

## Que hacer a continuación

Ahora que tenemos el sistema configurado, el siguiente paso es securizarlo para evitar accesos no autorizados, para ello, puedes ver los siguientes artículos:

- ~~Mejorar la seguridad con claves SSH~~ *(proximamente)*
- ~~Gestión del cortafuegos con firewalld~~ *(proximamente)*
