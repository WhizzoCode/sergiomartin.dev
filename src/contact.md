---
layout: layouts/base.njk
title: Contacto
---

# {{ title }}

¿En que puedo ayudarte?

Si quieres que trabajemos juntos en algun proyecto, o tienes alguna pregunta sobre lo que hago, no dudes en escribirme.

<form action="#">
  <label for="name" class="label-name">
    Nombre:<br>
    <input type="text" name="name" id="name"><br>
  </label>
  <label for="email" class="label-email">
    Correo electrónico:<br>
    <input type="email" name="email" id="email"><br>
  </label>
  <label for="message" class="label-message">
    Mensaje:<br>
    <textarea name="message" id="message" cols="30" rows="10"></textarea><br>
  </label>
  <button type="submit">Enviar</button>
</form>