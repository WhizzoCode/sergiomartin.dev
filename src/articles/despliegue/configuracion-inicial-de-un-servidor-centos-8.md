---
title: Configuración inicial de un servidor CentOS 8
description: Primeros pasos con un servidor CentOS 8
date: 2020-06-24
---

## Introducción

Cuando contratamos un servidor para desplegar nuestras aplicaciones web, el primer paso que debemos dar, antes de instalar el stack necesario para hacerlas funcionar, es hacer una **configuración básica** y **securización** del sistema. Para este artículo vamos a centrarnos en la primera parte, la **configuración inicial de un servidor CentOS 8**.

## Acceder al sistema

Partimos del punto en el que nuestro proveedor de hosting nos ha facilitado la **dirección IP** del equipo, la **contraseña** del usuario *root*, y el servidor tiene habilitado el acceso **SSH**.

Realizamos la conexión SSH como *root* hacia el servidor.

```shell
ssh root@HOST
```

Pudiendo ser **HOST** la dirección ip de la máquina, el hostname (si lo tenemos definido en nuestro archivo `/etc/hosts`) o el dominio (si tenemos alguno vinculado).

Y nos autenticamos con la contraseña facilitada.

Si es la primera vez que intentamos acceder a este host, es posible que el sistema nos pida confirmación para añadirlo a la lista de hosts conocidos y confiables. Aceptamos.

## Actualizar el sistema e instalaciones básicas

Actualizamos todos los paquetes instalados.

```shell
dnf update
```

Vamos a necesitar un editor de texto plano para editar los archivos de configuración del sistema. Aunque ya tenemos instalado **vim**, si no dominamos este programa podemos instalar alguno más sencillo como por ejemplo **nano**.

```shell
dnf install nano
```

## Gestión de usuarios

Cambiamos la contraseña del usuario *root* que nos ha facilitado nuestro proveedor de hosting por una propia.

```shell
passwd
```

Creamos otro usuario personal que será el que empleemos para acceder al sistema, dejando al usuario *root* únicamente para las tareas que lo requieran. El mío lo voy a llamar *eliot*.

```shell
adduser eliot
```

Definimos su contraseña.

```shell
passwd eliot
```

Si queremos que el usuario tenga privilegios de administración (el poder emplear `sudo`) hemos de añadirlo al grupo *wheel*.

```shell
gpasswd -a eliot wheel
```

Una buena práctica de seguridad es inhabilitar el acceso *root* por SSH. Siempre podremos acceder al sistema con nuestro nuevo usuario y una vez dentro escalar privilegios hacia *root* cuando necesitemos hacer alguna tarea de administración, empleando `sudo` o haciendo un cambio de usuario con `su`. Para ello vamos a editar el archivo `/etc/ssh/sshd_config` para descomentar y cambiar la siguiente directiva.

```properties /etc/ssh/sshd_config
PermitRootLogin no
```

Recargamos el servidor SSH para que los cambios tengan efecto.

```shell
systemctl reload sshd
```

## Nombre de equipo

Para gestionar el nombre del equipo disponemos de la herramienta `hostnamectl`. Si la invocamos sin argumentos nos da información de la configuración actual.

```text
   Static hostname: localhost
         Icon name: computer-vm
           Chassis: vm
        Machine ID: 83cfc9405edd410e3cc284d10eb1d90c
           Boot ID: 4d593aa90d5245b685fdf33b95b801a4
    Virtualization: vmware
  Operating System: CentOS Linux 8 (Core)
       CPE OS Name: cpe:/o:centos:centos:8
            Kernel: Linux 4.18.0-193.6.3.el8_2.x86_64
      Architecture: x86-64
```

Podemos cambiar el valor con el argumento `set-hostname`, para mi ejemplo la voy a llamar *fsociety*.

```shell
hostnamectl set-hostname fsociety
```

## Idioma

La herramienta con la que podemos cambiar el idioma del sistema (locale) es `localectl`. Igual que en el caso anterior, invocándola sin argumentos nos permite ver la configuración actual.

```text
   System Locale: LANG=en_US.UTF-8
       VC Keymap: us
      X11 Layout: n/a
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

Y hacemos el cambio a nuestro idioma con el argumento `set-locale`, en el ejemplo estoy cambiando a español de España con codificación de caracteres *utf-8*.

```shell
localectl set-locale LANG=es_ES.utf8
```

## Zona horaria y sincronización NTP

Para configurar la zona horaria disponemos de la herramienta `timedatectl`. Otra vez, invocándola sin argumentos nos permite ver la configuración actual.

```text
               Local time: Wed 2020-06-24 07:58:35 UTC
           Universal time: Wed 2020-06-24 07:58:35 UTC
                 RTC time: Wed 2020-06-24 07:58:35
                Time zone: UTC (UTC, +0000)
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

El comando `timedatectl` también nos informa de si está activa o no la sincronización horaria por NTP, por lo general cualquier instalación de CentOS 8 la tendría, si no lo está, hemos de instalar y habilitar **chrony**.

```shell
dnf install chrony
systemctl start chronyd
systemctl enable chronyd
```

## SELinux

SELinux es un módulo de seguridad del kernel Linux que añade políticas de seguridad extra a las generales de Linux (usuarios y grupos). Pero como contrapartida hace más compleja la configuración de nuestro entorno.

Los tres posibles estados de SELinux son:

- **Enforcing**: Deniega todos los accesos no autorizados a los recursos basándose en las políticas de seguridad definidas.

- **Permissive**: Permite todos los accesos, pero muestra una alerta cuando no se cumplan las políticas de seguridad.

- **Disabled**: SELinux deshabilitado.

Podemos ver el estado actual empleando los comandos `getenforce` o `sestatus`.

Para cambiar el estado hemos de editar el archivo `/etc/selinux/config`, modificamos el valor de la directiva `SELINUX`, en este caso vamos a cambiar a modo permisivo.

```properties /etc/selinux/config
SELINUX=permissive
```

Guardamos y reiniciamos el sistema para aplicar los cambios.

```shell
systemctl reboot
```

## Que hacer a continuación

Ahora que tenemos el sistema configurado, el paso siguiente es securizarlo para evitar accesos no autorizados, esto lo veremos en próximos artículos.
