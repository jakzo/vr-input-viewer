{
    "variables": {
        "platform": "<(OS)",
    },
    "conditions": [
        ['platform == "mac"', {"variables": {"platform": "darwin"}}],
        ['platform == "win"', {"variables": {"platform": "win32"}}],
    ],
    "targets": [
        {
            "target_name": "openvr",
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "xcode_settings": {
                "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                "CLANG_CXX_LIBRARY": "libc++",
                "MACOSX_DEPLOYMENT_TARGET": "10.7",
            },
            "msvs_settings": {
                "VCCLCompilerTool": {"ExceptionHandling": 1},
            },
            "sources": ["src/OpenVR/cpp/openvr.cpp", "src/OpenVR/cpp/ivrsystem.cpp"],
            "include_dirs": [
                "<!(node -p \"require('node-addon-api').include_dir\")",
                "<(module_root_dir)/deps/openvr/headers",
            ],
            "conditions": [
                [
                    'OS == "linux"',
                    {
                        "library_dirs": ["<(module_root_dir)/deps/openvr/lib/linux64"],
                        "libraries": ["libopenvr_api.so"],
                        "copies": [
                            {
                                "destination": "<(module_root_dir)/build/Release",
                                "files": [
                                    "<(module_root_dir)/deps/openvr/bin/linux64/libopenvr_api.so"
                                ],
                            }
                        ],
                    },
                ],
                [
                    'OS == "mac"',
                    {
                        "library_dirs": ["<(module_root_dir)/deps/openvr/lib/osx32"],
                        "libraries": ["libopenvr_api.dylib"],
                        "copies": [
                            {
                                "destination": "<(module_root_dir)/build/Release",
                                "files": [
                                    "<(module_root_dir)/deps/openvr/bin/osx32/libopenvr_api.dylib"
                                ],
                            }
                        ],
                    },
                ],
                [
                    'OS == "win"',
                    {
                        "library_dirs": ["<(module_root_dir)/deps/openvr/lib/win64"],
                        "libraries": ["openvr_api.lib"],
                        "defines": ["WIN32_LEAN_AND_MEAN", "VC_EXTRALEAN", "NOMINMAX"],
                        "msvs_settings": {
                            "VCCLCompilerTool": {
                                "AdditionalOptions": [
                                    "/O2",
                                    "/Oy",
                                    "/GL",
                                    "/GF",
                                    "/Gm-",
                                    "/EHsc",
                                    "/MT",
                                    "/GS",
                                    "/Gy",
                                    "/GR-",
                                    "/Gd",
                                ]
                            },
                            "VCLinkerTool": {
                                "AdditionalOptions": ["/OPT:REF", "/OPT:ICF", "/LTCG"]
                            },
                        },
                        "copies": [
                            {
                                "destination": "<(module_root_dir)/build/Release",
                                "files": [
                                    "<(module_root_dir)/deps/openvr/bin/win64/openvr_api.dll"
                                ],
                            }
                        ],
                    },
                ],
            ],
        }
    ],
}
