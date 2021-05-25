/*
this module generates styles from defaults (built in) and custom (user created)

user can:  
1) change existing styles [general, layout, contentType]
2) create own styles [content types]

*/
import general from './general'
import layout from './layout'
import contentType from './contentType'

export default { layout, contentType, general }
