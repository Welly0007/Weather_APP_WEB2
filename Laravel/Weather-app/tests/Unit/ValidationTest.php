<?php

namespace Tests\Unit;
use Illuminate\Support\Facades\Validator;


use Tests\TestCase;
class ValidationTest extends TestCase
{
    public function test_city_name_max_length_validation()
    {
        $validator = Validator::make([
            'city_name' => str_repeat('a', 101)
        ], [
            'city_name' => 'max:100'
        ]);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('city_name', $validator->errors()->toArray());
    }

    public function test_city_name_regex_validation()
    {
        $validator = Validator::make([
            'city_name' => '<script>alert(1)</script>'
        ], [
            'city_name' => ['regex:/^[a-zA-Z\\s-]+$/']
        ]);
        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('city_name', $validator->errors()->toArray());
    }

}
