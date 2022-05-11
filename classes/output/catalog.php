<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

namespace local_envasyllabus\output;

use renderable;
use renderer_base;
use stdClass;

/**
 * Catalog page
 */
class catalog implements renderable, \templatable {

    public function __construct() {
    }

    public function export_for_template(renderer_base $output) {
        $context = new stdClass();
        $context->courses = json_encode(['759', '763']);
        return $context;
    }
}