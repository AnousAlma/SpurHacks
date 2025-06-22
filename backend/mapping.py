LANG_MAP = {
    "javascript": ("javascript", "18.15.0"),
    "python":     ("python",     "3.10.0"),
    "cpp":        ("cpp",        "17.2.0"),
    "java":       ("java",       "21.0.1"),
}

def to_piston(lang: str):
    return LANG_MAP.get(lang)
