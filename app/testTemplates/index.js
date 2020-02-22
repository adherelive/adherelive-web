const ABI_TEST = {
  content: {
    arm: {
      content: {
        left: "Left",
        right: "Right",
        suffix: "mmHG"
      },
      label: "Arm"
    },
    leftAnkle: {
      content: {
        pt: "PT",
        dt: "DT",
        suffix: "mmHG"
      },
      label: "Left Ankle"
    },
    rightAnkle: {
      content: {
        pt: "PT",
        dt: "DT",
        suffix: "mmHG"
      },
      label: "Right Ankle"
    },
    abiIndex: {
      content: {
        overAllAbiIndex: "Over All ABI Index",
        suffix: "mmHG"
      },
      label: "ABI Index"
    }
  },
  label: "ABI Test"
};

const SomeXYZTest = {
  content: {
    eyes: {
      content: {
        left: "Left",
        right: "Right",
        suffix: "mmHG"
      },
      label: "Eyes"
    },
    ears: {
      content: {
        left: "Left",
        right: "Right",
        suffix: "mgh"
      },
      label: "Ears"
    },
    legs: {
      content: {
        left: "Left",
        right: "Right",
        suffix: "mmHG"
      },
      label: "Legs"
    },
    xyzIndex: {
      content: {
        overAllAbiIndex: "Over All XYZ Index",
        suffix: "mmHG"
      },
      label: "XYZ Index"
    }
  },
  label: "SomeXYZ Test"
};

module.exports = { ABI_TEST, SomeXYZTest };
