<?php

class Product{
    private $id;
    private $name;
    private $manufacturer;
    private $model;
    private $year;
    private $price;
    private $processor;
    private $ram_size;
    private $storage;
    private $display;
    private $os;
    private $battery;
    private $weight;
    private $dimensions;
    private $keyboard;
    private $ports;
    private $connectivity;
    private $camera;
    private $additional_features;
    private $image;
    private $sale;
    private $description;

    public function __construct(
        $id, $name, $manufacturer, $model, $year, $price, $processor,
        $ram_size, $storage, $display, $os, $battery, $weight, $dimensions,
        $keyboard, $ports, $connectivity, $camera, $additional_features,
        $image, $sale, $description
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->manufacturer = $manufacturer;
        $this->model = $model;
        $this->year = $year;
        $this->price = $price;
        $this->processor = $processor;
        $this->ram_size = $ram_size;
        $this->storage = $storage;
        $this->display = $display;
        $this->os = $os;
        $this->battery = $battery;
        $this->weight = $weight;
        $this->dimensions = $dimensions;
        $this->keyboard = $keyboard;
        $this->ports = $ports;
        $this->connectivity = $connectivity;
        $this->camera = $camera;
        $this->additional_features = $additional_features;
        $this->image = $image;
        $this->sale = $sale;
        $this->description = $description;
    }

    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }

    public function getManufacturer() {
        return $this->manufacturer;
    }

    public function getModel() {
        return $this->model;
    }

    public function getYear() {
        return $this->year;
    }

    public function getPrice() {
        return $this->price;
    }

    public function getProcessor() {
        return $this->processor;
    }

    public function getRamSize() {
        return $this->ram_size;
    }

    public function getStorage() {
        return $this->storage;
    }

    public function getDisplay() {
        return $this->display;
    }

    public function getOs() {
        return $this->os;
    }

    public function getBattery() {
        return $this->battery;
    }

    public function getWeight() {
        return $this->weight;
    }

    public function getDimensions() {
        return $this->dimensions;
    }

    public function getKeyboard() {
        return $this->keyboard;
    }

    public function getPorts() {
        return $this->ports;
    }

    public function getConnectivity() {
        return $this->connectivity;
    }

    public function getCamera() {
        return $this->camera;
    }

    public function getAdditionalFeatures() {
        return $this->additional_features;
    }

    public function getImage() {
        return $this->image;
    }

    public function getSale() {
        return $this->sale;
    }

    public function getDescription() {
        return $this->description;
    }
}

?>