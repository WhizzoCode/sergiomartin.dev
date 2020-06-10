
async function resize(originalFileName, width, outputPath, newFileName) {

  const r = Deno.run({
    cmd: [
      "mogrify",
      "-path",       outputPath,
      "-filter",     "Triangle",
      "-define",     "filter:support=2",
      "-thumbnail",  width,
      "-unsharp",    "0.25x0.25+8+0.065",
      "-dither",     "None",
      "-posterize",  "136",
      "-quality",    "82",
      "-define",     "jpeg:fancy-upsampling=off",
      "-define",     "png:compression-filter=5",
      "-define",     "png:compression-level=9",
      "-define",     "png:compression-strategy=1",
      "-define",     "png:exclude-chunk=all",
      "-interlace",  "none",
      "-colorspace", "sRGB",
      "-strip",
      originalFileName
    ]
  });

  await r.status();

  const oldPath = outputPath + originalFileName;
  const newPath = outputPath + newFileName;

  Deno.renameSync(oldPath, newPath);

  console.log(`Done: ${newFileName}`);

}

const outputPath = "../src/assets/images/";

resize('avatar.jpg', 180, outputPath, 'avatar-180w.jpg');
resize('avatar.jpg', 360, outputPath, 'avatar-360w.jpg');
resize('avatar.jpg', 540, outputPath, 'avatar-540w.jpg');
resize('avatar.jpg', 720, outputPath, 'avatar-720w.jpg');

resize('photoko.jpg',  320, outputPath, 'photoko-320w.jpg');
resize('photoko.jpg',  640, outputPath, 'photoko-640w.jpg');
resize('photoko.jpg',  960, outputPath, 'photoko-960w.jpg');
resize('photoko.jpg', 1280, outputPath, 'photoko-1280w.jpg');
