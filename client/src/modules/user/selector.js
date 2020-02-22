import {createSelector} from "reselect";

const getUser = (userData, id) => {
    if (!id) {
        return {};
    }
    return userData[id] || {};
};

const getCareCoaches = (userData, id) => {
    let careCoaches = {};
    if (userData[id]) {
        const currentUser = userData[id];
        const {programIds = []} = currentUser;
        for (let program of programIds) {
            const {careCoach} = program;
            if (careCoach !== null) {
                const {basicInfo = {}, work = {}, personalInfo = {}} =
                userData[careCoach] || {};
                careCoaches[careCoach] = {...basicInfo, ...work, ...personalInfo};
            }
        }
    }
    return careCoaches;
};

const getCaseDoctors = (userData, id) => {
    let doctors = {};
    if (userData[id]) {
        const currentUser = userData[id];
        const {programIds = []} = currentUser;
        for (let program of programIds) {
            const {doctor} = program;
            if (doctor !== null) {
                const {basicInfo = {}, work, personalInfo} = userData[doctor] || {};
                doctors[doctor] = {...basicInfo, ...work, ...personalInfo};
            }
        }
    }
    return doctors;
};

export const makeGetUserById = () =>
    createSelector(
        [getUser],
        users => {
            return users;
        }
    );

export const makeGetCaseDoctors = () =>
    createSelector(
        [getCaseDoctors],
        doctors => {
            return doctors;
        }
    );

export const makeGetCareCoaches = () =>
    createSelector(
        [getCareCoaches],
        careCoaches => {
            return careCoaches;
        }
    );
