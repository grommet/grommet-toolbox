'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packTasks = packTasks;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _tarballExtract = require('tarball-extract');

var _tarballExtract2 = _interopRequireDefault(_tarballExtract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function packTasks(gulp) {

  gulp.task('pack', function (done) {
    var packageJSON = _path2.default.join(process.cwd(), 'package.json');
    var contents = _fs2.default.readFileSync(packageJSON);
    var json = JSON.parse(contents);
    if (json.dependencies) {
      json.bundledDependencies = Object.keys(json.dependencies);
      _fs2.default.writeFileSync(packageJSON, JSON.stringify(json, null, 2));
    }

    try {
      _child_process2.default.exec('npm pack', function (err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);

        if (err) {
          throw err;
        }
        var licenseMap = {
          name: json.name,
          version: json.version,
          dependencies: {
            licenseNotFound: []
          }
        };

        var tarballName = json.name + '-' + json.version + '.tgz';
        _tarballExtract2.default.extractTarball(tarballName, './tmp', function (err) {
          if (err) {
            throw err;
          }
          var dependencies = _fs2.default.readdirSync('./tmp/package/node_modules');

          dependencies.forEach(function (dependency) {
            var dependencyPackageJSON = _path2.default.join(process.cwd(), 'node_modules/' + dependency + '/package.json');
            var contents = _fs2.default.readFileSync(dependencyPackageJSON);
            var json = JSON.parse(contents);
            var license = json.license;
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

          var dependencyLicense = _path2.default.join(process.cwd(), json.name + '-' + json.version + '-licenses.json');

          //write dependency license map
          _fs2.default.writeFileSync(dependencyLicense, JSON.stringify(licenseMap, null, 2));

          //revert original package.json
          _fs2.default.writeFileSync(packageJSON, JSON.stringify(JSON.parse(contents), null, 2));

          _del2.default.sync(['./tmp']);

          done();
        });
      });
    } catch (e) {
      console.log(e);

      //revert original package.json
      _fs2.default.writeFileSync(packageJSON, JSON.stringify(JSON.parse(contents), null, 2));

      done();
    }
  });
};

exports.default = packTasks;