package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc9Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc9.class);
        Abc9 abc91 = new Abc9();
        abc91.setId(1L);
        Abc9 abc92 = new Abc9();
        abc92.setId(abc91.getId());
        assertThat(abc91).isEqualTo(abc92);
        abc92.setId(2L);
        assertThat(abc91).isNotEqualTo(abc92);
        abc91.setId(null);
        assertThat(abc91).isNotEqualTo(abc92);
    }
}
