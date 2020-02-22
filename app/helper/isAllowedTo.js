const programService = require("../../app/services/program/program.service");

const serviceMapper = {
  program: id => programService.getProgram(id)
};

export default function isAllowedTo(req, res, { actor, resource, action }) {
  const { id } = req.params;
  let user = {};
  if (req.userDetails.exists) {
    user = req.userDetails.userData;
  }

  if (user.userCategory === actor) {
    if (id) {
      serviceMapper[resource](id).then(resourceData => {
        if (
          findInAnother(
            { name: actor, data: user },
            { name: resource, data: resourceData }
          )
        ) {
          next();
        }
      });
    }
  } else {
    // don't go ahead
  }

  return function(req, res, next) {
    next();
  };
}

function findInAnother(obj1, obj2) {
  const { name: name1, data: data1 } = obj1;
  const { name: name2, data: data2 } = obj2;
  if (Array.isArray(data1[name1])) {
    if (data1[name1].indexOf(data2._id) >= 0) {
      return true;
    }
  } else if (typeof data1[name1] === "object") {
    if (Object.keys(data1[name1]).indexOf(data2._id) >= 0) {
      return true;
    }
  } else if (typeof data1[name1] === "string") {
    if (data1[name1] == data2._id) {
      return true;
    }
  }

  if (Array.isArray(data2[name2])) {
    if (data2[name2].indexOf(data1._id) >= 0) {
      return true;
    }
  } else if (typeof data2[name2] === "object") {
    if (Object.keys(data2[name2]).indexOf(data1._id) >= 0) {
      return true;
    }
  } else if (typeof data2[name2] === "string") {
    if (data2[name2] == data1._id) {
      return true;
    }
  }
}
