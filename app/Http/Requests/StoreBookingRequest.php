<?php

namespace App\Http\Requests;

use App\Models\Service;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'location_id' => ['nullable', 'integer', Rule::exists('locations', 'id')],
            'service_id' => ['required', 'integer', Rule::exists(Service::class, 'id')],
            'vehicle_type' => ['required', 'string', 'in:motor,mobil,salon'],
            'vehicle_size' => ['nullable', 'string', 'in:M,L'],
            'vehicle_plate' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date', 'after:now'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'service_id.required' => 'Layanan wajib dipilih.',
            'service_id.exists' => 'Layanan yang dipilih tidak valid.',
            'vehicle_type.required' => 'Jenis kendaraan wajib dipilih.',
            'vehicle_type.in' => 'Jenis kendaraan harus motor, mobil, atau salon.',
            'vehicle_plate.required' => 'Nomor plat kendaraan wajib diisi.',
            'scheduled_at.required' => 'Tanggal dan waktu pemesanan wajib diisi.',
            'scheduled_at.after' => 'Tanggal dan waktu pemesanan harus di masa depan.',
        ];
    }
}
