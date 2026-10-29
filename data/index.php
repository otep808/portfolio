<?php
// Never serve the database directory.
http_response_code(403);
exit('Forbidden');
