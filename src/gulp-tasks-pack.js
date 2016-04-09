import path from 'path';
import del from 'del';
import fs from 'fs';
import cp from 'child_process';
import tarball from 'tarball-extract';

export function packTasks (gulp) {

  gulp.task('pack', (done) => {
    const packageJSON = path.join(process.cwd(), 'package.json');
    const contents = fs.readFileSync(packageJSON);
    const json = JSON.parse(contents);
    if (json.dependencies) {
      json.bundledDependencies = Object.keys(json.dependencies);
      fs.writeFileSync(packageJSON, JSON.stringify(json, null, 2));
    }

    try {
      cp.exec('npm pack', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);

        if (err) {
          throw err;
        }
        const licenseMap = {
          name: json.name,
          version: json.version,
          dependencies: {
            licenseNotFound: []
          }
        };

        const tarballName = `${json.name}-${json.version}.tgz`;
        tarball.extractTarball(tarballName, './tmp', (err) => {
          if (err) {
            throw err;
          }
          const dependencies = fs.readdirSync('./tmp/package/node_modules');

          dependencies.forEach((dependency) => {
            const dependencyPackageJSON = path.join(
              process.cwd(), `node_modules/${dependency}/package.json`
            );
            const contents = fs.readFileSync(dependencyPackageJSON);
            const json = JSON.parse(contents);
            let license = json.license;
            if (!license && json.licenses) {
              license = json.licenses[0];
            }

            if (!license) {
              licenseMap.dependencies.licenseNotFound.push(dependency);
            } else if (license.type) {
              licenseMap.dependencies[dependency] = license.type;
            } else {
              licenseMap.dependencies[dependency] = license;
            }
          });

          const dependencyLicense = path.join(
            process.cwd(), `${json.name}-${json.version}-licenses.json`
          );

          //write dependency license map
          fs.writeFileSync(dependencyLicense, JSON.stringify(
            licenseMap, null, 2)
          );

          //revert original package.json
          fs.writeFileSync(packageJSON, JSON.stringify(
            JSON.parse(contents), null, 2)
          );

          del.sync(['./tmp']);

          done();
        });
      });
    } catch (e) {
      console.log(e);

      //revert original package.json
      fs.writeFileSync(packageJSON, JSON.stringify(
        JSON.parse(contents), null, 2)
      );

      done();
    }
  });
};

export default packTasks;
