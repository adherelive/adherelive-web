import { connect } from "react-redux";
import TestAgoraVideo from "../../Components/ChatFullScreen/testAgoraVideo";
import { fetchVideoAccessToken } from "../../modules/agora";

const mapStateToProps = (state) => {
  const {
    agora = {},
    users = {},
    auth = {},
    patients = {},
    doctors = {},
  } = state;
  console.log(
    "=======================mapStateToProps Test Agora Video================="
  );
  console.log({ agora, users, auth, patients, doctors });
  console.log(
    "=======================mapStateToProps Test Agora Video================="
  );
  return { agora, users, auth, patients, doctors };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVideoAccessToken: (userId) => dispatch(fetchVideoAccessToken(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestAgoraVideo);
