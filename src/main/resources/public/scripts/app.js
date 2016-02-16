var app = angular.module('habridge', ['ngRoute','ngToast']);

app.config(function ($routeProvider) {
	$routeProvider.when('/#', {
		templateUrl: 'views/configuration.html',
		controller: 'ViewingController'
	}).when('/system', {
		templateUrl: 'views/system.html',
		controller: 'SystemController'		
	}).when('/editor', {
		templateUrl: 'views/editor.html',
		controller: 'AddingController'		
	}).when('/editdevice', {
		templateUrl: 'views/editdevice.html',
		controller: 'AddingController'		
	}).when('/veradevices', {
		templateUrl: 'views/veradevice.html',
		controller: 'AddingController'		
	}).when('/verascenes', {
		templateUrl: 'views/verascene.html',
		controller: 'AddingController'		
	}).when('/harmonydevices', {
		templateUrl: 'views/harmonydevice.html',
		controller: 'AddingController'		
	}).when('/harmonyactivities', {
		templateUrl: 'views/harmonyactivity.html',
		controller: 'AddingController'		
	}).when('/nest', {
		templateUrl: 'views/nestactions.html',
		controller: 'AddingController'		
	}).otherwise({
		templateUrl: 'views/configuration.html',
		controller: 'ViewingController'
	})
});

app.run( function (bridgeService) {
	bridgeService.loadBridgeSettings();
	bridgeService.getHABridgeVersion();	
});

app.service('bridgeService', function ($http, $window, ngToast) {
	var self = this;
	this.state = {base: window.location.origin + "/api/devices", bridgelocation: window.location.origin, systemsbase: window.location.origin + "/system", huebase: window.location.origin + "/api", configs: [], backups: [], devices: [], device: [], settings: [], myToastMsg: [], olddevicename: "", showVera: false, showHarmony: false, showNest: false, habridgeversion: ""};

	this.viewDevices = function () {
		return $http.get(this.state.base).then(
				function (response) {
					self.state.devices = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Cannot get devices from habridge: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.getHABridgeVersion = function () {
		return $http.get(this.state.systemsbase + "/habridge/version").then(
				function (response) {
					self.state.habridgeversion = response.data.version;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Cannot get version" + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.aContainsB = function (a, b) {
		return a.indexOf(b) >= 0;
	}

	this.updateShowVera = function () {
		this.state.showVera = self.state.settings.veraconfigured;
		return;
	}

	this.updateShowNest = function () {
		this.state.showNest = self.state.settings.nestconfigured;
		return;
	}

	this.updateShowHarmony = function () {
		this.state.showHarmony = self.state.settings.harmonyconfigured;
		return;
	}

	this.loadBridgeSettings = function () {
		return $http.get(this.state.systemsbase + "/settings").then(
				function (response) {
					self.state.settings = response.data;
					self.updateShowVera();
					self.updateShowHarmony();
					self.updateShowNest();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Load Bridge Settings Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.viewBackups = function () {
		return $http.get(this.state.base + "/backup/available").then(
				function (response) {
					self.state.backups = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Get Backups Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.viewConfigs = function () {
		return $http.get(this.state.systemsbase + "/backup/available").then(
				function (response) {
					self.state.configs = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Get Configs Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.viewNestItems = function () {
		if(!this.state.showNest)
			return;
		return $http.get(this.state.base + "/nest/items").then(
				function (response) {
					self.state.nestitems = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Get Nest Items Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.viewVeraDevices = function () {
		if(!this.state.showVera)
			return;
		return $http.get(this.state.base + "/vera/devices").then(
				function (response) {
					self.state.veradevices = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Get Vera Devices Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.viewVeraScenes = function () {
		if(!this.state.showVera)
			return;
		return $http.get(this.state.base + "/vera/scenes").then(
				function (response) {
					self.state.verascenes = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Get Vera Scenes Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.viewHarmonyActivities = function () {
		if(!this.state.showHarmony)
			return;
		return $http.get(this.state.base + "/harmony/activities").then(
				function (response) {
					self.state.harmonyactivities = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Get Harmony Activities Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.viewHarmonyDevices = function () {
		if(!this.state.showHarmony)
			return;
		return $http.get(this.state.base + "/harmony/devices").then(
				function (response) {
					self.state.harmonydevices = response.data;
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Get Harmony Devices Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.findDeviceByMapId = function(id, target, type) {
		for(var i = 0; i < this.state.devices.length; i++) {
			if(this.state.devices[i].mapId == id && this.state.devices[i].mapType == type && this.state.devices[i].targetDevice == target)
				return true;
		}
		return false;
	};

	this.findNestItemByMapId = function(id, type) {
		for(var i = 0; i < this.state.devices.length; i++) {
			if(this.state.devices[i].mapId == id && this.aContainsB(this.state.devices[i].mapType, type))
				return true;
		}
		return false;
	};

	this.bulkAddDevice = function (devices) {
		return $http.post(this.state.base, devices).then(
				function (response) {
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Bulk Add new Device Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.addDevice = function (device) {
		if(device.httpVerb != null && device.httpVerb != "")
			device.deviceType = "custom";
		if(device.targetDevice == null || device.targetDevice == "")
			device.targetDevice = "Encapsulated";
		if (device.id) {
			var putUrl = this.state.base + "/" + device.id;
			return $http.put(putUrl, {
				id: device.id,
				name: device.name,
				mapId: device.mapId,
				mapType: device.mapType,
				deviceType: device.deviceType,
				targetDevice: device.targetDevice,
				onUrl: device.onUrl,
				offUrl: device.offUrl,
				httpVerb: device.httpVerb,
				contentType: device.contentType,
				contentBody: device.contentBody,
				contentBodyOff: device.contentBodyOff
			}).then(
					function (response) {
					},
					function (error) {
						ngToast.create({
							className: "warning",
							content:"Edit Device Error: " + "unknown error" || error.data.message + " with status: " + error.status});
					}
			);
		} else {
			if(device.deviceType == null || device.deviceType == "")
				device.deviceType = "custom";
			return $http.post(this.state.base, {
				name: device.name,
				mapId: device.mapId,
				mapType: device.mapType,
				deviceType: device.deviceType,
				targetDevice: device.targetDevice,
				onUrl: device.onUrl,
				offUrl: device.offUrl,
				httpVerb: device.httpVerb,
				contentType: device.contentType,
				contentBody: device.contentBody,
				contentBodyOff: device.contentBodyOff
			}).then(
					function (response) {
					},
					function (error) {
						ngToast.create({
							className: "warning",
							content:"Add new Device Error: " + "unknown error" || error.data.message + " with status: " + error.status});
					}
			);
		}
	};

	this.backupDeviceDb = function (afilename) {
		return $http.put(this.state.base + "/backup/create", {
			filename: afilename
		}).then(
				function (response) {
					self.viewBackups();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Backup Device Db Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.restoreBackup = function (afilename) {
		return $http.post(this.state.base + "/backup/restore", {
			filename: afilename
		}).then(
				function (response) {
					self.viewBackups();
					self.viewDevices();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Backup Db Restore Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.deleteBackup = function (afilename) {
		return $http.post(this.state.base + "/backup/delete", {
			filename: afilename
		}).then(
				function (response) {
					self.viewBackups();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Delete Backup Db File Error:" + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.checkForBridge = function () {
		return $http.get(this.state.bridgelocation + "/description.xml").then(
				function (response) {
					ngToast.dismiss(self.state.myToastMsg);
					self.viewConfigs();
					self.state.myToastMsg = null;
				},
				function (error) {
					setTimeout(function(){
						self.checkForBridge();
					}, 2000);
				}
		);

	};

	this.stop = function() {
		return $http.put(this.state.systemsbase + "/control/stop").then(
				function (response) {
					ngToast.create({
						className: "danger",
						dismissButton: true,
						dismissOnTimeout: false,
						content:"HABridge is now stopped. Restart must occur from the server."});
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"HABRidge Stop Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.reinit = function() {
		return $http.put(this.state.systemsbase + "/control/reinit").then(
				function (response) {
					self.state.myToastMsg = ngToast.create({
						className: "warning",
						dismissButton: false,
						dismissOnTimeout: false,
						content:"HABridge is re-initializing, waiting for completion..."});
					setTimeout(function(){
						self.checkForBridge();
					}, 2000);
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"HABRidge Reinit Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.saveSettings = function () {
		return $http.put(this.state.systemsbase + "/settings", this.state.settings).then(
				function (response) {
					self.reinit();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Save Settings Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);

	};

	this.backupSettings = function (afilename) {
		return $http.put(this.state.systemsbase + "/backup/create", {
			filename: afilename
		}).then(
				function (response) {
					self.viewConfigs();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Backup Settings Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.restoreSettings = function (afilename) {
		return $http.post(this.state.systemsbase + "/backup/restore", {
			filename: afilename
		}).then(
				function (response) {
					self.viewConfigs();
					self.viewDevices();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Backup Settings Restore Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.deleteSettingsBackup = function (afilename) {
		return $http.post(this.state.systemsbase + "/backup/delete", {
			filename: afilename
		}).then(
				function (response) {
					self.viewConfigs();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Delete Backup Settings File Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.deleteDevice = function (id) {
		return $http.delete(this.state.base + "/" + id).then(
				function (response) {
					self.viewDevices();
				},
				function (error) {
					ngToast.create({
						className: "warning",
						content:"Delete Device Error: " + "unknown error" || error.data.message + " with status: " + error.status});
				}
		);
	};

	this.deleteDeviceByMapId = function (id, type) {
		for(var i = 0; i < this.state.devices.length; i++) {
			if(this.state.devices[i].mapId == id && this.aContainsB(this.state.devices[i].mapType, type))
				return self.deleteDevice(this.state.devices[i].id);
		}
	};

	this.editDevice = function (device) {
		self.state.device = device;
		self.state.olddevicename = device.name;
	};

	this.testUrl = function (device, type) {
		if(type == "on") {
			$http.put(this.state.huebase + "/test/lights/" + device.id + "/state", "{\"on\":true}").then(
					function (response) {
						ngToast.create({
							className: "success",
							content:"Request Exceuted: " + response.statusText});
					},
					function (error) {
						ngToast.create({
							className: "warning",
							content:"Request Error: " + error.statusText + ", with status: " + error.status + ", Pleae look in your console log."});
					}
			);
			return;        		
		}
		else {
			$http.put(this.state.huebase + "/test/lights/" + device.id + "/state", "{\"on\":false}").then(
					function (response) {
						ngToast.create({
							className: "success",
							content:"Request Exceuted: " + response.statusText});
					},
					function (error) {
						ngToast.create({
							className: "warning",
							content:"Request Error: " + error.statusText + ", with status: " + error.status + ", Pleae look in your console log."});
					}
			);
			return;        		
		}
	};
});

app.controller('SystemController', function ($scope, $location, $http, $window, bridgeService) {
    bridgeService.viewConfigs();
    $scope.bridge = bridgeService.state;
    $scope.optionalbackupname = "";
    $scope.visible = false;
    $scope.imgUrl = "glyphicon glyphicon-plus";
    $scope.visibleBk = false;
    $scope.imgBkUrl = "glyphicon glyphicon-plus";
    $scope.addVeratoSettings = function (newveraname, newveraip) {
    	if($scope.bridge.settings.veraddress == null) {
			$scope.bridge.settings.veraddress = { devices: [] };
		}
    	var newVera = {name: newveraname, ip: newveraip }
    	$scope.bridge.settings.veraaddress.devices.push(newVera);
    	$scope.newveraname = null;
    	$scope.newveraip = null;
    };
    $scope.removeVeratoSettings = function (veraname, veraip) {
    	for(var i = $scope.bridge.settings.veraaddress.devices.length - 1; i >= 0; i--) {
    	    if($scope.bridge.settings.veraaddress.devices[i].name === veraname && $scope.bridge.settings.veraaddress.devices[i].ip === veraip) {
    	    	$scope.bridge.settings.veraaddress.devices.splice(i, 1);
    	    }
    	}    	
    };
    $scope.addHarmonytoSettings = function (newharmonyname, newharmonyip) {
    	if($scope.bridge.settings.harmonyaddress == null) {
			$scope.bridge.settings.harmonyaddress = { devices: [] };
		}
    	var newharmony = {name: newharmonyname, ip: newharmonyip }
    	$scope.bridge.settings.harmonyaddress.devices.push(newharmony);
    	$scope.newharmonyname = null;
    	$scope.newharmonyip = null;
    };
    $scope.removeHarmonytoSettings = function (harmonyname, harmonyip) {
    	for(var i = $scope.bridge.settings.harmonyaddress.devices.length - 1; i >= 0; i--) {
    	    if($scope.bridge.settings.harmonyaddress.devices[i].name === harmonyname && $scope.bridge.settings.harmonyaddress.devices[i].ip === harmonyip) {
    	    	$scope.bridge.settings.harmonyaddress.devices.splice(i, 1);
    	    }
    	}    	
    };
    $scope.bridgeReinit = function () {
    	bridgeService.reinit();
    };
    $scope.bridgeStop = function () {
    	bridgeService.stop();
    };
    $scope.saveSettings = function() {
    	bridgeService.saveSettings();
    };
    $scope.setBridgeUrl = function (url) {
        bridgeService.state.base = url;
        bridgeService.viewDevices();
    };
    $scope.goBridgeUrl = function (url) {
    	window.open(url, "_blank");
    };
    $scope.backupSettings = function (optionalbackupname) {
        bridgeService.backupSettings(optionalbackupname);
    };
    $scope.restoreSettings = function (backupname) {
        bridgeService.restoreSettings(backupname);
    };
    $scope.deleteSettingsBackup = function (backupname) {
        bridgeService.deleteSettingsBackup(backupname);
    };
    $scope.toggle = function () {
        $scope.visible = !$scope.visible;
        if($scope.visible)
            $scope.imgUrl = "glyphicon glyphicon-minus";
        else
            $scope.imgUrl = "glyphicon glyphicon-plus";
    };
    $scope.toggleBk = function () {
        $scope.visibleBk = !$scope.visibleBk;
        if($scope.visibleBk)
            $scope.imgBkUrl = "glyphicon glyphicon-minus";
        else
            $scope.imgBkUrl = "glyphicon glyphicon-plus";
    };
});

app.controller('ViewingController', function ($scope, $location, $http, $window, bridgeService) {

	bridgeService.viewDevices();
	bridgeService.viewBackups();
	$scope.bridge = bridgeService.state;
	$scope.optionalbackupname = "";
	$scope.visible = false;
	$scope.imgUrl = "glyphicon glyphicon-plus";
	$scope.visibleBk = false;
	$scope.imgBkUrl = "glyphicon glyphicon-plus";
	$scope.predicate = '';
	$scope.reverse = true;
	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};
	$scope.deleteDevice = function (device) {
		bridgeService.deleteDevice(device.id);
	};
	$scope.testUrl = function (device, type) {
		bridgeService.testUrl(device, type);
	};
	$scope.editDevice = function (device) {
		bridgeService.editDevice(device);
		$location.path('/editdevice');
	};
	$scope.backupDeviceDb = function (optionalbackupname) {
		bridgeService.backupDeviceDb(optionalbackupname);
	};
	$scope.restoreBackup = function (backupname) {
		bridgeService.restoreBackup(backupname);
	};
	$scope.deleteBackup = function (backupname) {
		bridgeService.deleteBackup(backupname);
	};
	$scope.toggle = function () {
		$scope.visible = !$scope.visible;
		if($scope.visible)
			$scope.imgUrl = "glyphicon glyphicon-minus";
		else
			$scope.imgUrl = "glyphicon glyphicon-plus";
	};
	$scope.toggleBk = function () {
		$scope.visibleBk = !$scope.visibleBk;
		if($scope.visibleBk)
			$scope.imgBkUrl = "glyphicon glyphicon-minus";
		else
			$scope.imgBkUrl = "glyphicon glyphicon-plus";
	};
});

app.controller('AddingController', function ($scope, $location, $http, bridgeService) {
	$scope.bridge = bridgeService.state;
	$scope.device = $scope.bridge.device;
	$scope.device_dim_control = "";
	$scope.bulk = { devices: [] };
	var veraList = angular.fromJson($scope.bridge.settings.veraaddress);
	if(veraList != null)
		$scope.vera = {base: "http://" + veraList.devices[0].ip, port: "3480", id: ""};
	else
		$scope.vera = {base: "http://", port: "3480", id: ""};
	bridgeService.viewVeraDevices();
	bridgeService.viewVeraScenes();
	bridgeService.viewHarmonyActivities();
	bridgeService.viewHarmonyDevices();
	bridgeService.viewNestItems();
	$scope.imgButtonsUrl = "glyphicon glyphicon-plus";
	$scope.buttonsVisible = false;

	$scope.predicate = '';
	$scope.reverse = true;
	$scope.order = function(predicate) {
		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};

	$scope.clearDevice = function () {
		$scope.device.id = "";
		$scope.device.mapType = null;
		$scope.device.mapId = null;
		$scope.device.name = "";
		$scope.device.onUrl = "";
		$scope.device.deviceType = "custom";
		$scope.device.targetDevice = null;
		$scope.device.offUrl = "";
		$scope.device.httpVerb = null;
		$scope.device.contentType = null;
		$scope.device.contentBody = null;
		$scope.device.contentBodyOff = null;
		$scope.bridge.olddevicename = "";
	};
	$scope.clearDevice();
	$scope.buildUrlsUsingDevice = function (dim_control) {
		if ($scope.vera.base.indexOf("http") < 0) {
			$scope.vera.base = "http://" + $scope.vera.base;
		}
		$scope.device.deviceType = "switch";
		$scope.device.targetDevice = "Encapsulated";
		$scope.device.mapType = "veraDevice";
		$scope.device.mapId = $scope.vera.id;
		if(dim_control.indexOf("byte") >= 0 || dim_control.indexOf("percent") >= 0 || dim_control.indexOf("math") >= 0)
			$scope.device.onUrl = $scope.vera.base + ":" + $scope.vera.port
			+ "/data_request?id=action&output_format=json&DeviceNum="
			+ $scope.vera.id
			+ "&serviceId=urn:upnp-org:serviceId:Dimming1&action=SetLoadLevelTarget&newLoadlevelTarget="
			+ dim_control;
		else
			$scope.device.onUrl = $scope.vera.base + ":" + $scope.vera.port
			+ "/data_request?id=action&output_format=json&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue=1&DeviceNum="
			+ $scope.vera.id;
		$scope.device.offUrl = $scope.vera.base + ":" + $scope.vera.port
		+ "/data_request?id=action&output_format=json&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue=0&DeviceNum="
		+ $scope.vera.id;
	};

	$scope.buildUrlsUsingScene = function () {
		if ($scope.vera.base.indexOf("http") < 0) {
			$scope.vera.base = "http://" + $scope.vera.base;
		}
		$scope.device.deviceType = "scene";
		$scope.device.targetDevice = "Encapsulated";
		$scope.device.mapType = "veraScene";
		$scope.device.mapId = $scope.vera.id;
		$scope.device.onUrl = $scope.vera.base + ":" + $scope.vera.port
		+ "/data_request?id=action&output_format=json&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="
		+ $scope.vera.id;
		$scope.device.offUrl = $scope.vera.base + ":" + $scope.vera.port
		+ "/data_request?id=action&output_format=json&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="
		+ $scope.vera.id;
	};

	$scope.buildDeviceUrls = function (veradevice, dim_control) {
		$scope.device.deviceType = "switch";
		$scope.device.name = veradevice.name;
		$scope.device.targetDevice = veradevice.veraname;
		$scope.device.mapType = "veraDevice";
		$scope.device.mapId = veradevice.id;
		if(dim_control.indexOf("byte") >= 0 || dim_control.indexOf("percent") >= 0 || dim_control.indexOf("math") >= 0)
			$scope.device.onUrl = "http://" + veradevice.veraaddress + ":" + $scope.vera.port
			+ "/data_request?id=action&output_format=json&DeviceNum="
			+ veradevice.id
			+ "&serviceId=urn:upnp-org:serviceId:Dimming1&action=SetLoadLevelTarget&newLoadlevelTarget="
			+ dim_control;
		else
			$scope.device.onUrl = "http://" + veradevice.veraaddress + ":" + $scope.vera.port
			+ "/data_request?id=action&output_format=json&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue=1&DeviceNum="
			+ veradevice.id;
		$scope.device.offUrl = "http://" + veradevice.veraaddress + ":" + $scope.vera.port
		+ "/data_request?id=action&output_format=json&serviceId=urn:upnp-org:serviceId:SwitchPower1&action=SetTarget&newTargetValue=0&DeviceNum="
		+ veradevice.id;
	};

	$scope.buildSceneUrls = function (verascene) {
		$scope.device.deviceType = "scene";
		$scope.device.name = verascene.name;
		$scope.device.targetDevice = verascene.veraname;
		$scope.device.mapType = "veraScene";
		$scope.device.mapId = verascene.id;
		$scope.device.onUrl = "http://" + verascene.veraaddress + ":" + $scope.vera.port
		+ "/data_request?id=action&output_format=json&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="
		+ verascene.id;
		$scope.device.offUrl = "http://" + verascene.veraaddress + ":" + $scope.vera.port
		+ "/data_request?id=action&output_format=json&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="
		+ verascene.id;
	};

	$scope.buildActivityUrls = function (harmonyactivity) {
		$scope.device.deviceType = "activity";
		$scope.device.targetDevice = harmonyactivity.hub;
		$scope.device.name = harmonyactivity.activity.label;
		$scope.device.mapType = "harmonyActivity";
		$scope.device.mapId = harmonyactivity.activity.id;
		$scope.device.onUrl = "{\"name\":\"" + harmonyactivity.activity.id + "\"}";
		$scope.device.offUrl = "{\"name\":\"-1\"}";
	};

	$scope.buildButtonUrls = function (harmonydevice, onbutton, offbutton) {
		var currentOn = $scope.device.onUrl;
		var currentOff = $scope.device.offUrl;
		var actionOn = angular.fromJson(onbutton);
		var actionOff = angular.fromJson(offbutton);
		if( $scope.device.mapType == "harmonyButton") {
			$scope.device.onUrl = currentOn.substr(0, currentOn.indexOf("]")) + ",{\"device\":\"" + harmonydevice.device.id + "\",\"button\":\"" + actionOn.command + "\"}]";
			$scope.device.offUrl = currentOff.substr(0, currentOff.indexOf("]")) + ",{\"device\":\"" + harmonydevice.device.id + "\",\"button\":\"" + actionOff.command + "\"}]";        		
		}
		else if ($scope.device.mapType == null || $scope.device.mapType == "") {
			$scope.device.deviceType = "button";
			$scope.device.targetDevice = harmonydevice.hub;
			$scope.device.name = harmonydevice.device.label;
			$scope.device.mapType = "harmonyButton";
			$scope.device.mapId = harmonydevice.device.id + "-" + actionOn.command + "-" + actionOff.command;
			$scope.device.onUrl = "[{\"device\":\"" + harmonydevice.device.id + "\",\"button\":\"" + actionOn.command + "\"}]";
			$scope.device.offUrl = "[{\"device\":\"" + harmonydevice.device.id + "\",\"button\":\"" + actionOff.command + "\"}]";
		}
	};

	$scope.buildNestHomeUrls = function (nestitem) {
		$scope.device.deviceType = "home";
		$scope.device.name = nestitem.name;
		$scope.device.targetDevice = nestitem.name;
		$scope.device.mapType = "nestHomeAway";
		$scope.device.mapId = nestitem.id;
		$scope.device.onUrl = "{\"name\":\"" + nestitem.id + "\",\"away\":false,\"control\":\"status\"}";
		$scope.device.offUrl = "{\"name\":\"" + nestitem.id + "\",\"away\":true,\"control\":\"status\"}";
	};

	$scope.buildNestTempUrls = function (nestitem) {
		$scope.device.deviceType = "thermo";
		$scope.device.name = nestitem.name.substr(0, nestitem.name.indexOf("(")) + " Temperature";
		$scope.device.targetDevice = nestitem.location;
		$scope.device.mapType = "nestThermoSet";
		$scope.device.mapId = nestitem.id + "-SetTemp";
		$scope.device.onUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"temp\",\"temp\":\"${intensity.percent}\"}";
		$scope.device.offUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"temp\",\"temp\":\"${intensity.percent}\"}";
	};

	$scope.buildNestHeatUrls = function (nestitem) {
		$scope.device.deviceType = "thermo";
		$scope.device.name = nestitem.name.substr(0, nestitem.name.indexOf("(")) + " Heat";
		$scope.device.targetDevice = nestitem.location;
		$scope.device.mapType = "nestThermoSet";
		$scope.device.mapId = nestitem.id + "-SetHeat";
		$scope.device.onUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"heat\"}";
		$scope.device.offUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"off\"}";
	};

	$scope.buildNestCoolUrls = function (nestitem) {
		$scope.device.deviceType = "thermo";
		$scope.device.name = nestitem.name.substr(0, nestitem.name.indexOf("(")) + " Cool";
		$scope.device.targetDevice = nestitem.location;
		$scope.device.mapType = "nestThermoSet";
		$scope.device.mapId = nestitem.id + "-SetCool";
		$scope.device.onUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"cool\"}";
		$scope.device.offUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"off\"}";
	};

	$scope.buildNestRangeUrls = function (nestitem) {
		$scope.device.deviceType = "thermo";
		$scope.device.name = nestitem.name.substr(0, nestitem.name.indexOf("(")) + " Range";
		$scope.device.targetDevice = nestitem.location;
		$scope.device.mapType = "nestThermoSet";
		$scope.device.mapId = nestitem.id + "-SetRange";
		$scope.device.onUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"range\"}";
		$scope.device.offUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"off\"}";
	};

	$scope.buildNestOffUrls = function (nestitem) {
		$scope.device.deviceType = "thermo";
		$scope.device.name = nestitem.name.substr(0, nestitem.name.indexOf("(")) + " Thermostat";
		$scope.device.targetDevice = nestitem.location;
		$scope.device.mapType = "nestThermoSet";
		$scope.device.mapId = nestitem.id + "-TurnOff";
		$scope.device.onUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"range\"}";
		$scope.device.offUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"off\"}";
	};

	$scope.buildNestFanUrls = function (nestitem) {
		$scope.device.deviceType = "thermo";
		$scope.device.name = nestitem.name.substr(0, nestitem.name.indexOf("(")) + " Fan";
		$scope.device.targetDevice = nestitem.location;
		$scope.device.mapType = "nestThermoSet";
		$scope.device.mapId = nestitem.id + "-SetFan";
		$scope.device.onUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"fan-on\"}";
		$scope.device.offUrl = "{\"name\":\"" + nestitem.id + "\",\"control\":\"fan-auto\"}";
	};

	$scope.testUrl = function (device, type) {
		bridgeService.testUrl(device, type);
	};

	$scope.addDevice = function () {
		if($scope.device.name == "" && $scope.device.onUrl == "")
			return;
		bridgeService.addDevice($scope.device).then(
				function () {
					$scope.clearDevice();
				},
				function (error) {
				}
		);

	};

	$scope.copyDevice = function () {
		if($scope.device.name == "" && $scope.device.onUrl == "") {
			$scope.clearDevice();
			return;
		}

		if($scope.device.name == $scope.bridge.olddevicename) {
			$scope.clearDevice();
			return;
		}
		$scope.device.id = null;
		bridgeService.addDevice($scope.device).then(
				function () {
					$scope.clearDevice();
				},
				function (error) {
				}
		);

	};

	$scope.bulkAddDevices = function(dim_control) {
		var devicesList = [];
		for(var i = 0; i < $scope.bulk.devices.length; i++) {
			for(var x = 0; x < bridgeService.state.veradevices.length; x++) {
				if(bridgeService.state.veradevices[x].id == $scope.bulk.devices[i]) {
					$scope.buildDeviceUrls(bridgeService.state.veradevices[x],dim_control);
					devicesList[i] = {
							name: $scope.device.name,
							mapId: $scope.device.mapId,
							mapType: $scope.device.mapType,
							deviceType: $scope.device.deviceType,
							targetDevice: $scope.device.targetDevice,
							onUrl: $scope.device.onUrl,
							offUrl: $scope.device.offUrl,
							httpVerb: $scope.device.httpVerb,
							contentType: $scope.device.contentType,
							contentBody: $scope.device.contentBody,
							contentBodyOff: $scope.device.contentBodyOff
					};
				}
			}
		}
		bridgeService.bulkAddDevice(devicesList);
		$scope.clearDevice();
		$scope.bulk = { devices: [] };
	};

	$scope.toggleSelection = function toggleSelection(deviceId) {
		var idx = $scope.bulk.devices.indexOf(deviceId);

		// is currently selected
		if (idx > -1) {
			$scope.bulk.devices.splice(idx, 1);
		}

		// is newly selected
		else {
			$scope.bulk.devices.push(deviceId);
		}
	};

	$scope.toggleButtons = function () {
		$scope.buttonsVisible = !$scope.buttonsVisible;
		if($scope.buttonsVisible)
			$scope.imgButtonsUrl = "glyphicon glyphicon-minus";
		else
			$scope.imgButtonsUrl = "glyphicon glyphicon-plus";
	};

	$scope.deleteDeviceByMapId = function (id, mapType) {
		bridgeService.deleteDeviceByMapId(id, mapType);
	};

});

app.filter('availableHarmonyActivityId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(!bridgeService.findDeviceByMapId(input[i].activity.id, input[i].hub, "harmonyActivity")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('unavailableHarmonyActivityId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(bridgeService.findDeviceByMapId(input[i].activity.id, input[i].hub, "harmonyActivity")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('availableVeraDeviceId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(!bridgeService.findDeviceByMapId(input[i].id, input[i].veraname, "veraDevice")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('unavailableVeraDeviceId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(bridgeService.findDeviceByMapId(input[i].id, input[i].veraname, "veraDevice")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('availableVeraSceneId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(!bridgeService.findDeviceByMapId(input[i].id, input[i].veraname, "veraScene")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('unavailableVeraSceneId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(bridgeService.findDeviceByMapId(input[i].id,input[i].veraname, "veraScene")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('availableNestItemId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(!bridgeService.findNestItemByMapId(input[i].id, "nestHomeAway")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('unavailableNestItemId', function(bridgeService) {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(input[i].mapType != null && bridgeService.aContainsB(input[i].mapType, "nest")){
				out.push(input[i]);
			}
		}
		return out;
	}
});

app.filter('configuredButtons', function() {
	return function(input) {
		var out = [];
		if(input == null)
			return out;
		for (var i = 0; i < input.length; i++) {
			if(input[i].mapType == "harmonyButton"){
				out.push(input[i]);
			}
		}
		return out;
	}
});


app.controller('ErrorsController', function ($scope, bridgeService) {
	$scope.bridge = bridgeService.state;
});

app.controller('VersionController', function ($scope, bridgeService) {
	$scope.bridge = bridgeService.state;
});