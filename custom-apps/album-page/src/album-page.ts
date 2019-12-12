import { injectReact } from "dom"
import { requestInject } from "shared/injection.helper"
import "./style.sass"

requestInject().then(() => injectReact())