<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Saved_city extends Model
{
    protected $fillable = [
        'city_name',
        'country_code',
        'Added_at',
    ];
    public $timestamps = false;
}
