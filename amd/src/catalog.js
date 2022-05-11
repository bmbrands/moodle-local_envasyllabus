// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Javascript to initialise the enva syllabus catalog page.
 *
 * @package    local_envasyllabus
 * @copyright  2022 CALL Learning <laurent@call-learning.fr>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import * as repository from './repository';
import {exception as displayException} from 'core/notification';
import Templates from "core/templates";
import Config from 'core/config';

/**
 * Initialise catalog
 *
 * @param catalogTagId
 */
export const init = (catalogTagId) => {
    const catalogNode = document.getElementById(catalogTagId);
    const catalogCourseTag = catalogNode.querySelector('.catalog-courses');
    const coursesIds = JSON.parse(catalogCourseTag.dataset.courses);
    repository.getCoursesFromIds(coursesIds).then((data) => renderCourses(catalogNode, data.courses)).catch(displayException);
};

/**
 * Render all courses
 *
 * @param element element to render into
 * @param courses list of courses with data
 */
const renderCourses = (element, courses) => {
    Templates.render('local_envasyllabus/catalog_course_categories', {
        sortedCourses: sortCoursesByYearAndSemester(courses)
    }).then((html, js) => {
        Templates.replaceNodeContents(element, html, js);
    }).catch(displayException);
};

/**
 * Sort courses by year and semester
 *
 * @param courses courses
 * @returns Array
 */
const sortCoursesByYearAndSemester = (courses) => {
    let sortedCourses = {};
    for(let course of courses.values()) {
        const yearValue = findValueForCustomField(course, 'uc_annee');
        const semesterValue = findValueForCustomField(course, 'uc_semestre');
        if (yearValue) {
            if (!sortedCourses.hasOwnProperty(yearValue)) {
                sortedCourses[yearValue] = {
                    year: yearValue,
                    semesters: []
                };
            }
            if (semesterValue) {
                if (!sortedCourses[yearValue].semesters[semesterValue]) {
                    sortedCourses[yearValue].semesters[semesterValue] = {
                        semester: semesterValue,
                        year: yearValue,
                        courses: []
                    };
                }
                if (course.overviewfiles && course.overviewfiles.length > 0) {
                    // Hack here: We just want to change from webservice url that need a token.
                    // to a simple url for a plugin.
                    course.courseimageurl = course.overviewfiles[0].fileurl.replace('/webservice', '');
                }
                course.viewurl = Config.wwwroot + '/course/view.php?id=' + course.id;
                sortedCourses[yearValue].semesters[semesterValue].courses.push(course);
            }
        }
    }
    // Flattern the object into an array.
    return Object.values(sortedCourses).map(
        yearDef => {
            return {
                year: yearDef.year,
                semesters: Object.values(yearDef.semesters)
            };
        }
    );
};

/**
 * Retrieve the value of a give customfield from course data
 *
 * @param course course data
 * @param cfsname shortname for customfield
 * @param defaultValue
 * @returns null|Object|int|String
 */
const findValueForCustomField = (course, cfsname, defaultValue=null) => {
    if (typeof course.customfields !== 'undefined') {
        for (let cf of course.customfields.values()) {
            if (cf.shortname === cfsname) {
                return cf.value;
            }
        }
    }
    return defaultValue;
};