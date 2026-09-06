class _TyphonResult:
    __slots__ = ("_typhon_result_kind", "value", "sites")

    def __init__(self, kind, value, sites=None):
        self._typhon_result_kind = kind
        self.value = value
        self.sites = list(sites or ())

    def __repr__(self):
        return f"{self._typhon_result_kind}({self.value!r})"


class _TyphonPropagateSignal(BaseException):
    __slots__ = ("result",)

    def __init__(self, result):
        self.result = result


def _typhon_ok(value=None):
    return _TyphonResult("ok", value)


def _typhon_error(value):
    return _TyphonResult("error", value)


def _typhon_propagate(result, file, line, function):
    kind = getattr(result, "_typhon_result_kind", None)
    if kind == "ok":
        return result.value
    if kind != "error":
        raise TypeError("propagate expected a Typhon result value")
    sites = [*result.sites, (file, line, function)]
    raise _TyphonPropagateSignal(_TyphonResult("error", result.value, sites))


def _typhon_panic(result):
    import sys as _typhon_sys
    print(f"Typhon panic: {result.value}", file=_typhon_sys.stderr)
    for file, line, function in result.sites:
        print(f"  at {file}:{line} in {function}", file=_typhon_sys.stderr)
    raise SystemExit(1)
def _typhon_format(value):
    return "null" if value is None else str(value)
def readNumber(valid):
    try:
        if valid == False:
            return _typhon_error("invalid")
        return _typhon_ok(4)
    except _TyphonPropagateSignal as _typhon_signal:
        return _typhon_signal.result

def addOne(valid):
    try:
        value = _typhon_propagate(readNumber(valid), '<memory>', 9, 'addOne')
        return _typhon_ok(value + 1)
    except _TyphonPropagateSignal as _typhon_signal:
        return _typhon_signal.result

outcome = addOne(True)
_typhon_result_0 = outcome
if _typhon_result_0._typhon_result_kind == 'ok':
    _typhon_b1_value = _typhon_result_0.value
    print(_typhon_format(_typhon_b1_value))
elif _typhon_result_0._typhon_result_kind == 'error':
    _typhon_b2_message = _typhon_result_0.value
    print(_typhon_format(_typhon_b2_message))
